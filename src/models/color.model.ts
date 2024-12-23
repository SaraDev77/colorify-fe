export type Color = {
  _id:number,
  color: string
  quote: string
}

export type colorRequest = Omit<Color,'_id'>