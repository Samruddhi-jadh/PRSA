export function checkMetaDescription(description: string | null) {

  if (!description) {
    return {
      parameterName: "meta_description",
      category: "onpage",
      score: 0,
      passed: false
    }
  }

  const length = description.length

  const passed = length >= 120 && length <= 160

  return {
    parameterName: "meta_description_length",
    category: "onpage",
    score: passed ? 1 : 0.5,
    passed
  }
}