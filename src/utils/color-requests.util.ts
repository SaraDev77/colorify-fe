import apiClient from '../interceptors/client'
import type { Color } from '../models/color.model'

// Query parameters interface
export interface QueryParams {
  page: number
  perPage: number
}

// Response type for fetching colors
export interface ColorResponse {
  colors: Color[]
  pagination: {
    page: number
    perPage: number
    total: number
    totalPages: number
  }
}

export const colorsService = {
    async fetchColors(page: number, perPage: number, search: string) {
      try {
        const { data } = await apiClient.get('/api/colors', {
          params: {
            page,
            perPage,
            search, // Include the search parameter in the request
          },
        });
        return data;
      } catch (error) {
        console.error('Error fetching colors:', error);
        throw error;
      }
    },
    
  async fetchSingleColor(id: string): Promise<Color> {
    try {
      const { data } = await apiClient.get<{ color: Color }>(`/api/colors/${id}`)
      if (!data?.color) throw new Error('Color data is missing')
      return data.color
    } catch (error) {
      console.error('Error fetching single color:', error)
      throw new Error('Failed to fetch color')
    }
  },

  async createColor(newColor: Partial<Color>) {
    try {
      await apiClient.post('/api/colors', newColor)
    } catch (error) {
      console.error('Error creating color:', error)
      throw error
    }
  },

  async updateColor(updatedColor: Partial<Color>, id: number): Promise<void> {
    try {
      await apiClient.put(`/api/colors/${id}`, updatedColor)
    } catch (error) {
      console.error('Error updating color:', error)
      throw error
    }
  },

  async deleteColor(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/colors/${id}`)
    } catch (error) {
      console.error('Error deleting color:', error)
      throw error
    }
  },
}
