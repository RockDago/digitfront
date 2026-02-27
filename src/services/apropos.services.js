// src/services/apropos.services.js
import API from "../config/axios";

/**
 * Récupère l'en-tête global "À propos" + les sections.
 * GET /api/apropos
 */
export async function fetchApropos() {
  const response = await API.get("/apropos");
  // réponse: { id, titre, description, sections: [...] }
  return response.data;
}

/**
 * Met à jour l'en-tête global (titre + description).
 * PUT /api/apropos
 * payload: { titre?: string, description?: string }
 */
export async function updateAproposGlobal(payload) {
  const response = await API.put("/apropos", payload);
  return response.data;
}

/**
 * Liste toutes les sections (normalement déjà incluses dans /apropos).
 * GET /api/apropos/sections
 */
export async function fetchSections() {
  const response = await API.get("/apropos/sections");
  return response.data;
}

/**
 * Crée une nouvelle section.
 * POST /api/apropos/sections
 * payload: { title, content, position }
 */
export async function createSection(payload) {
  const response = await API.post("/apropos/sections", payload);
  return response.data;
}

/**
 * Met à jour une section existante.
 * PUT /api/apropos/sections/{id}
 * payload: { title?, content?, position? }
 */
export async function updateSection(id, payload) {
  const response = await API.put(`/apropos/sections/${id}`, payload);
  return response.data;
}

/**
 * Supprime une section.
 * DELETE /api/apropos/sections/{id}
 */
export async function deleteSection(id) {
  await API.delete(`/apropos/sections/${id}`);
  return true;
}
