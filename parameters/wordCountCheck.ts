export function checkWordCount(wordCount: number) {

  const passed = wordCount >= 300

  return {
    parameterName: "word_count",
    category: "content",
    score: passed ? 1 : 0.3,
    passed
  }
}