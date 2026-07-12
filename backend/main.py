from collections import defaultdict, deque
from typing import List, Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# The React dev server (localhost:3000) and this API (localhost:8000) run on
# different origins, so the browser needs CORS permission to POST here.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Node(BaseModel):
    id: str

    class Config:
        extra = "allow"  # nodes carry lots of ReactFlow-specific fields (position, data, type...)


class Edge(BaseModel):
    id: Optional[str] = None
    source: str
    target: str

    class Config:
        extra = "allow"


class PipelineRequest(BaseModel):
    nodes: List[Node]
    edges: List[Edge]


def is_directed_acyclic_graph(node_ids: List[str], edges: List[Edge]) -> bool:
    """Kahn's algorithm: a graph is a DAG iff topological sort visits every node."""
    in_degree = {node_id: 0 for node_id in node_ids}
    adjacency = defaultdict(list)

    for edge in edges:
        if edge.source not in in_degree or edge.target not in in_degree:
            continue  # ignore edges referencing a node id we don't know about
        adjacency[edge.source].append(edge.target)
        in_degree[edge.target] += 1

    queue = deque([node_id for node_id, degree in in_degree.items() if degree == 0])
    visited_count = 0

    while queue:
        current = queue.popleft()
        visited_count += 1
        for neighbor in adjacency[current]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    return visited_count == len(node_ids)


@app.get('/')
def read_root():
    return {'Ping': 'Pong'}


@app.post('/pipelines/parse')
def parse_pipeline(pipeline: PipelineRequest):
    node_ids = [node.id for node in pipeline.nodes]
    num_nodes = len(node_ids)
    num_edges = len(pipeline.edges)
    is_dag = is_directed_acyclic_graph(node_ids, pipeline.edges)

    return {
        'num_nodes': num_nodes,
        'num_edges': num_edges,
        'is_dag': is_dag,
    }
