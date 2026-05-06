export const frameworkLanguageMap = {
    Playwright: ["TypeScript", "JavaScript", "Java", "Python", "C#"],
    Selenium: ["Java", "Python", "C#", "JavaScript", "Ruby"],
    PyTest: ["Python"],
    Cypress: ["TypeScript", "JavaScript"],
    WebdriverIO: ["TypeScript", "JavaScript"],
    Appium: ["Java", "Python", "JavaScript", "C#", "Ruby"],
    "Robot Framework": ["Python"],
    TestCafe: ["TypeScript", "JavaScript"],
    Puppeteer: ["TypeScript", "JavaScript"],
    Nightwatch: ["JavaScript"],
    CodeceptJS: ["TypeScript", "JavaScript"],
};

export const languageFrameworkMap = {
    TypeScript: [
        "Playwright",
        "Cypress",
        "WebdriverIO",
        "TestCafe",
        "Puppeteer",
        "CodeceptJS",
    ],
    JavaScript: [
        "Playwright",
        "Selenium",
        "Cypress",
        "WebdriverIO",
        "Appium",
        "TestCafe",
        "Puppeteer",
        "Nightwatch",
        "CodeceptJS",
    ],
    Java: ["Playwright", "Selenium", "Appium"],
    Python: ["Playwright", "PyTest", "Selenium", "Appium", "Robot Framework"],
    "C#": ["Playwright", "Selenium", "Appium"],
    Ruby: ["Selenium", "Appium"],
};

export const getAvailableFrameworks = (language) => {
    if (!language) {
        return Object.keys(frameworkLanguageMap);
    }
    return languageFrameworkMap[language] || [];
};

export const getAvailableLanguages = (framework) => {
    if (!framework) {
        return Object.keys(languageFrameworkMap);
    }
    return frameworkLanguageMap[framework] || [];
};

export const isValidFrameworkLanguagePair = (framework, language) => {
    if (!framework || !language) return true;
    return frameworkLanguageMap[framework]?.includes(language);
};