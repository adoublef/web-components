import { lowerCase } from "./lower_case";

import { nonWordRegexp, camelCaseRegexp, camelCaseUpperRegexp } from "./regex.ts";

export function normalCase(
    str: string,
    locale?: string,
    replacement?: string,
): string {
    if (str == null) {
        return "";
    }

    replacement = typeof replacement !== "string" ? " " : replacement;

    function replace(match: string, index: number, value: string): string {
        if (index === 0 || index === value.length - match.length) {
            return "";
        }

        return replacement!;
    }

    str = String(str)
        // Support camel case ("camelCase" -> "camel Case").
        .replace(camelCaseRegexp, "$1 $2")
        // Support odd camel case ("CAMELCase" -> "CAMEL Case").
        .replace(camelCaseUpperRegexp, "$1 $2")
        // Remove all non-word characters and replace with a single space.
        .replace(nonWordRegexp, replace);

    // Lower case the entire string.
    return lowerCase(str, locale);
}