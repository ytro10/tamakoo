# -*- coding: utf-8 -*-
from flask import Flask, render_template, jsonify, abort, make_response
import numpy as np
import gensim
from gensim.models import doc2vec
from sklearn.metrics.pairwise import cosine_similarity
wakati = lambda sentence: gensim.utils.simple_preprocess(sentence, min_len=1)

import secure
from neo4jrestclient.client import GraphDatabase
url = secure.url
gdb = GraphDatabase(url)

api = Flask(__name__)

@api.route('/')
def index():
    return open('index.html', encoding='utf-8').read()

@api.route('/dist/bundle.js')
def bundle():
    return open('dist/bundle.js', encoding='utf-8').read()

@api.route('/api/toot/<string:toot_text>', methods=['GET'])
def api_toot(toot_text):
    vec = model.infer_vector(wakati(toot_text))
    sims = cosine_similarity([vec], doc_vecs)
    index = np.argsort(sims[0])[::-1]
    #res_text = ''.join([''.join(doc[index[i]].split(' ')) for i in range(20)])
    res_text = ''
    for i in range(20):
        res_text += ''.join([''.join(doc[index[i]].split(' '))]).split('\n')[0]+',normal\n'
    result = {
        'text': res_text
        }
    return make_response(jsonify(result))

@api.route('/api/catchCard/<int:card_id>', methods=['GET'])
def api_cardlines(card_id):
    print(card_id)

    now_id = card_id

    user_id, user_name, when, card_id, card_text, card_url = gdb.query('\
        MATCH p=(a)<-[t:Toot]-(c) WHERE ID(a)={}\
        RETURN ID(c), c.name, t.when, ID(a), a.text, a.url\
        '.format(now_id))[0]
    now_line = ','.join([str(user_id), user_name, when, str(card_id), card_text, 'None' if card_url==None else card_url, 'called'])

    pre_id = now_id
    pre_lines = []
    for i in range(10):
        try:
            user_id, user_name, when, pre_id, pre_text, pre_url = gdb.query('\
                MATCH p=(a)-[r:Anchor]->(b)<-[t:Toot]-(c) WHERE ID(a)={}\
                RETURN ID(c), c.name, t.when, ID(b), b.text, b.url\
                '.format(pre_id))[0]
            line = ','.join([str(user_id), user_name, when, str(pre_id), pre_text, 'None' if pre_url==None else pre_url, 'normal'])
            pre_lines.append(line)
        except:
            break

    next_id = now_id
    next_lines = []
    for i in range(10):
        try:
            user_id, user_name, when, next_id, next_text, next_url = gdb.query('\
                MATCH p=(a)<-[r:Anchor]-(b)<-[t:Toot]-(c) WHERE ID(a)={}\
                RETURN ID(c), c.name, t.when, ID(b), b.text, b.url\
                '.format(next_id))[0]
            line = ','.join([str(user_id), user_name, when, str(next_id), next_text, 'None' if next_url==None else next_url, 'normal'])
            next_lines.append(line)
        except:
            break

    lines = pre_lines[::-1] + [now_line] + next_lines
    res_text = '\n'.join(lines)
    result = {
        'text': res_text
        }
    return make_response(jsonify(result))

@api.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)

if __name__ == '__main__':
    model_name = 'echo_model/doc2vec.20170611T223642.model'
    toots_fname = 'dump/tamakoo.20170611T220442.test.csv'

    model = gensim.models.Doc2Vec.load(model_name)
    doc = open(toots_fname, encoding='utf-8').readlines()
    doc_vecs = [ model.infer_vector(wakati(line.split(',')[4])) for line in doc ]

    api.run(host='0.0.0.0', port=3000)
