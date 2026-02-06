type MentorData = {
  name: string
  image: string
}

let currentMentor: MentorData | null = null

export const mentorState = {
  set: (data: MentorData) => {
    currentMentor = data
  },
  get: (): MentorData | null => {
    return currentMentor
  },
  clear: () => {
    currentMentor = null
  },
}
