export function checkTitle(title: string | null) {

  if (!title) {
    return {
      parameterName: "title_present",
      category: "onpage",
      score: 0,
      passed: false
    }
  }

  const length = title.length

  const passed = length >= 30 && length <= 60

  return {
    parameterName: "title_length",
    category: "onpage",
    score: passed ? 1 : 0.5,
    passed
  }
}