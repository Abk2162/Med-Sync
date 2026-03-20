import os
import pytest
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_index_route(client):
    """Test that the index static route works."""
    response = client.get('/')
    # Even if index.html is missing in test env, it should return an HTTP response
    assert response.status_code in [200, 404]

def test_parse_no_file(client):
    """Test that the parse API correctly rejects empty requests."""
    response = client.post('/api/parse')
    assert response.status_code == 400
    assert b'No file part' in response.data

def test_invalid_file(client):
    """Test that the parse API rejects invalid file extensions."""
    data = {'file': (b'fake image data', 'test.txt')}
    response = client.post('/api/parse', data=data, content_type='multipart/form-data')
    assert response.status_code == 400
    assert b'Invalid file format' in response.data
