export const formatTestcase = (tc) => {
    return `
${tc.testcaseId}: ${tc.title}

Type: ${tc.type}

Preconditions:
${tc.preconditions.map((p) => `- ${p}`).join("\n")}

Steps:
${tc.steps.map((step, i) => `${i + 1}. ${step}`).join("\n")}

Expected Result:
${tc.expected}
`.trim();

};