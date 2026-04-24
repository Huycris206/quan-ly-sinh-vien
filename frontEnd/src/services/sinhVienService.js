const BASE_URL = 'http://localhost:5001/api';

export const getAllSinhVien = () => {
  return fetch(`${BASE_URL}/sinhvien`)
    .then(res => res.json())
    .then(json => json.data);
};

export const getSinhVienById = (id) => {
  return fetch(`${BASE_URL}/sinhvien/${id}`)
    .then(res => res.json())
    .then(json => json.data);
};

export const createSinhVien = (data) => {
  return fetch(`${BASE_URL}/sinhvien`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json());
};

export const updateSinhVien = (id, data) => {
  return fetch(`${BASE_URL}/sinhvien/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json());
};

export const deleteSinhVien = (id) => {
  return fetch(`${BASE_URL}/sinhvien/${id}`, {
    method: 'DELETE'
  }).then(res => res.json());
};