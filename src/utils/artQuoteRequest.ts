import axios from 'axios'

export const artQuoteService = {
  async fetchQuote() {
    try {
      const { data } = await axios.get('https://api.api-ninjas.com/v1/quotes?category=art', {
        headers: { 'X-Api-Key': '9eW/ZhL/KjtKRMHLy/7jLA==HTemffGhsntDITmQ' },
      })
      return data
    } catch (error) {
      console.error('Error Fetching Quote', error)
      throw error
    }
  },
}
