import itertools
import os
import re
import subprocess
import time

from django.core.files import File

from formulavis.celeryconf import app
from formulavis.settings import SATELITE_PATH

from profiles.models import JsonFile, TextFile, Profile


@app.task()
def create_json(obj_id, js_id, js_format):
    formats = {
        'sat_vis_factor': create_sat_vis_factor,
        'sat_vis_interaction': create_sat_vis_interaction,
        'sat_vis_resolution': create_sat_vis_resolution,
        'maxsat_vis_factor': create_maxsat_vis_factor,
        'maxsat_vis_interaction': create_maxsat_vis_interaction,
        'maxsat_vis_resolution': create_maxsat_vis_resolution,
        'raw': create_raw
    }

    formats.get(js_format).delay(obj_id, js_id, js_format)


@app.task()
def create_sat_vis_factor(obj_id, js_id, js_format):
    print("SAT_VIS_FACTOR")
    obj = JsonFile.objects.get(id=js_id)

    obj.status = 'pending'
    obj.save()

    data = {
        "info": None,
        "nodes": [],
        "edges": []
    }

    nodes_tmp = {}
    edges_tmp = {}

    clause = 0

    text_file = TextFile.objects.get(id=obj_id)
    with open(text_file.content.path) as f:
        text = File(f)
        for line in text:
            if line.startswith('c') or line.startswith('C') or line in ['', ' ']:
                continue
            if line.startswith('p'):
                data['info'] = line.split(' ')
            else:
                numbers = [int(x) for x in list(filter(lambda x: x != '', line.strip().split(' ')))[:-1]]
                if not numbers:
                    continue
                clause += 1
                clause_id = -clause
                nodes_tmp['C_' + str(clause)] = {"id": clause_id, "label": 'C_' + str(clause), "group": 0}

                for n in numbers:
                    y = abs(n)
                    nodes_tmp[y] = {"id": y, "label": str(y), "group": 1}

                for n in numbers:
                    k = (abs(n), clause_id)
                    color = 'red' if n < 0 else 'green'
                    edges_tmp[k] = {"from": k[0], "to": k[1], "color": {"color": color, "opacity": 1}}

    data['nodes'] = [v for k, v in nodes_tmp.items()]
    data['edges'] = [v for k, v in edges_tmp.items()]

    obj.content = data
    obj.status = 'done'
    obj.save()


@app.task()
def create_sat_vis_interaction(obj_id, js_id, js_format):
    print("SAT_VIS_INTERACTION")
    obj = JsonFile.objects.get(id=js_id)

    obj.status = 'pending'
    obj.save()

    data = {
        "info": None,
        "nodes": [],
        "edges": []
    }

    nodes_tmp = {}
    edges_tmp = {}

    text_file = TextFile.objects.get(id=obj_id)
    with open(text_file.content.path) as f:
        text = File(f)
        for line in text:
            if line.startswith('c') or line.startswith('C') or line in ['', ' ']:
                continue
            if line.startswith('p'):
                data['info'] = line.split(' ')
            else:
                numbers = [int(x) for x in list(filter(lambda x: x != '', line.strip().split(' ')))[:-1]]
                if not numbers:
                    continue
                for n in numbers:
                    y = abs(n)
                    nodes_tmp[y] = {"id": y, "label": str(y)}

                for k in itertools.combinations(numbers, 2):
                    k = tuple(sorted(map(lambda c: abs(c), k)))
                    try:
                        edges_tmp[k]["color"]["opacity"] += 0.1
                    except KeyError:
                        edges_tmp[k] = {"from": k[0], "to": k[1], "color": {"color": '#000000',
                                                                            "opacity": 0.1}}

    data['nodes'] = [v for k, v in nodes_tmp.items()]
    data['edges'] = [v for k, v in edges_tmp.items()]

    obj.content = data
    obj.status = 'done'
    obj.save()


@app.task()
def create_sat_vis_resolution(obj_id, js_id, js_format):
    print("SAT_VIS_RESOLUTION")
    obj = JsonFile.objects.get(id=js_id)

    obj.status = 'pending'
    obj.save()

    data = {
        "info": None,
        "nodes": [],
        "edges": []
    }

    nodes_tmp = {}
    edges_tmp = {}

    variables = {}
    clause = 0

    text_file = TextFile.objects.get(id=obj_id)
    with open(text_file.content.path) as f:
        text = File(f)
        for line in text:
            if line.startswith('c') or line.startswith('C') or line in ['', ' ']:
                continue
            if line.startswith('p'):
                data['info'] = line.split(' ')
            else:
                numbers = [int(x) for x in list(filter(lambda x: x != '', line.strip().split(' ')))[:-1]]
                if not numbers:
                    continue
                clause += 1
                nodes_tmp[clause] = {"id": clause, "label": 'C_' + str(clause)}
                for n in numbers:
                    if n not in variables.keys():
                        variables[n] = []
                    variables[n].append(clause)

    for v, clause_list_1 in variables.items():
        if v < 0:
            continue
        if -v in variables.keys():
            clause_list_2 = variables[-v]

            for c1 in clause_list_1:
                for c2 in clause_list_2:
                    edges_tmp[(c1, c2)] = {"from": c1, "to": c2}

    data['nodes'] = [v for k, v in nodes_tmp.items()]
    data['edges'] = [v for k, v in edges_tmp.items()]

    obj.content = data
    obj.status = 'done'
    obj.save()


@app.task()
def create_raw(obj_id, js_id, js_format):
    print("RAW")
    obj = JsonFile.objects.get(id=js_id)
    text_file = TextFile.objects.get(id=obj_id)
    obj.status = 'pending'
    obj.save()
    data = {"raw": ""}
    with open(text_file.content.path) as f:
        text = File(f)
        t = text.read()
        data["raw"] = t
        obj.content = data
    obj.status = 'done'
    obj.save()


@app.task()
def create_minimized(obj_id, profile_id):
    print("MINIMIZING: {}".format(obj_id))
    time.sleep(5)

    base_file = TextFile.objects.get(id=obj_id)
    profile = Profile.objects.get(id=profile_id)

    base_path = base_file.content.path
    satelite_path = re.sub(r'.cnf', '_min.cnf', base_path)
    name = re.sub(r'.cnf', '_min.cnf', base_file.name)

    subprocess.call([SATELITE_PATH, base_path, satelite_path], stdout=open(os.devnull, 'wb'))

    with open(satelite_path, 'r') as f:
        text = File(f)

        TextFile.objects.create(
            profile=profile,
            name=name,
            content=text,
            minimized=True
        )

    os.remove(satelite_path)
    print("DONE: {}".format(obj_id))


@app.task()
def create_maxsat_vis_factor(obj_id, js_id, js_format):
    print("MAXSAT_VIS_FACTOR")
    obj = JsonFile.objects.get(id=js_id)

    obj.status = 'pending'
    obj.save()

    data = {
        "info": None,
        "nodes": [],
        "edges": []
    }

    nodes_tmp = {}
    edges_tmp = {}

    clause = 0

    text_file = TextFile.objects.get(id=obj_id)
    with open(text_file.content.path) as f:
        text = File(f)
        for line in text:
            if line.startswith('c') or line.startswith('C') or line in ['', ' ']:
                continue
            if line.startswith('p'):
                data['info'] = line.split(' ')
            else:
                numbers = [int(x) for x in list(filter(lambda x: x != '', line.strip().split(' ')))[:-1]]
                if not numbers:
                    continue
                clause += 1
                clause_id = -clause
                clause_weight = numbers[0]
                del numbers[0]
                nodes_tmp['C_' + str(clause)] = {"id": clause_id, "font":{"size": clause_weight}, "label": 'C_' + str(clause), "group": 0}                

                for n in numbers:
                    y = abs(n)
                    nodes_tmp[y] = {"id": y, "label": str(y), "group": 1}

                for n in numbers:
                    k = (abs(n), clause_id)
                    color = 'red' if n < 0 else 'green'
                    edges_tmp[k] = {"from": k[0], "to": k[1], "color": {"color": color, "opacity": 1}}

    data['nodes'] = [v for k, v in nodes_tmp.items()]
    data['edges'] = [v for k, v in edges_tmp.items()]

    obj.content = data
    obj.status = 'done'
    obj.save()


@app.task()
def create_maxsat_vis_interaction(obj_id, js_id, js_format):
    print("MAXSAT_VIS_INTERACTION")
    obj = JsonFile.objects.get(id=js_id)

    obj.status = 'pending'
    obj.save()

    data = {
        "info": None,
        "nodes": [],
        "edges": []
    }

    nodes_tmp = {}
    edges_tmp = {}

    text_file = TextFile.objects.get(id=obj_id)
    with open(text_file.content.path) as f:
        text = File(f)
        for line in text:
            if line.startswith('c') or line.startswith('C') or line in ['', ' ']:
                continue
            if line.startswith('p'):
                data['info'] = line.split(' ')
            else:
                numbers = [int(x) for x in list(filter(lambda x: x != '', line.strip().split(' ')))[:-1]]
                if not numbers:
                    continue
                for n in numbers:
                    y = abs(n)
                    nodes_tmp[y] = {"id": y, "label": str(y)}

                for k in itertools.combinations(numbers, 2):
                    k = tuple(sorted(map(lambda c: abs(c), k)))
                    try:
                        edges_tmp[k]["color"]["opacity"] += 0.1
                    except KeyError:
                        edges_tmp[k] = {"from": k[0], "to": k[1], "color": {"color": '#000000',
                                                                            "opacity": 0.1}}

    data['nodes'] = [v for k, v in nodes_tmp.items()]
    data['edges'] = [v for k, v in edges_tmp.items()]

    obj.content = data
    obj.status = 'done'
    obj.save()


@app.task()
def create_maxsat_vis_resolution(obj_id, js_id, js_format):
    print("MAXSAT_VIS_RESOLUTION")
    obj = JsonFile.objects.get(id=js_id)

    obj.status = 'pending'
    obj.save()

    data = {
        "info": None,
        "nodes": [],
        "edges": []
    }

    nodes_tmp = {}
    edges_tmp = {}

    variables = {}
    clause = 0

    text_file = TextFile.objects.get(id=obj_id)
    with open(text_file.content.path) as f:
        text = File(f)
        for line in text:
            if line.startswith('c') or line.startswith('C') or line in ['', ' ']:
                continue
            if line.startswith('p'):
                data['info'] = line.split(' ')
            else:
                numbers = [int(x) for x in list(filter(lambda x: x != '', line.strip().split(' ')))[:-1]]
                if not numbers:
                    continue
                clause += 1
                clause_weight = numbers[0]
                del numbers[0]
                nodes_tmp[clause] = {"id": clause, "font":{"size": clause_weight}, "label": 'C_' + str(clause)}
                for n in numbers:
                    if n not in variables.keys():
                        variables[n] = []
                    variables[n].append(clause)

    for v, clause_list_1 in variables.items():
        if v < 0:
            continue
        if -v in variables.keys():
            clause_list_2 = variables[-v]

            for c1 in clause_list_1:
                for c2 in clause_list_2:
                    edges_tmp[(c1, c2)] = {"from": c1, "to": c2}

    data['nodes'] = [v for k, v in nodes_tmp.items()]
    data['edges'] = [v for k, v in edges_tmp.items()]

    obj.content = data
    obj.status = 'done'
    obj.save()

