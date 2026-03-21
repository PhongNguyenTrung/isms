import { request } from './client';

export async function getMenu() {
  return request('/menu/');
}
