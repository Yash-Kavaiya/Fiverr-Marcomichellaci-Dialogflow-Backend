import fs from "fs"
import path from "path"
import { MessageKeys, messageVariableMap, MessageVariables } from "../data/messagesKey"

type LanguageCode = "en" | "es" | string

const messagesPath = path.resolve(__dirname, "../data/messages.json")
const messages = JSON.parse(fs.readFileSync(messagesPath, "utf-8"))

/**
 * Fetches a localized message and replaces placeholders with provided variables.
 * @param languageCode - The language code (e.g., "en", "es").
 * @param key - The key of the message (e.g., "BOOKING_SAVED").
 * @param variables - An object containing variables to replace in the message.
 * @returns The formatted message or a default fallback message.
 */
export const getMessage = <K extends MessageKeys>(
    languageCode: LanguageCode,
    key: K,
    variables: MessageVariables[K]
): string => {
    const languageMessages = messages[languageCode] || messages["en"]
    const template = languageMessages[key] || `Message not found: ${key}`

    if (!template) {
        throw new Error(`Message key "${key}" not found for language "${languageCode}".`);
    }

    const requiredVariables = messageVariableMap[key] || [];
    const missingVariables = requiredVariables.filter((varName) => !(varName in variables));

    if (missingVariables.length > 0) {
        throw new Error(
            `Missing variables for message "${key}": ${missingVariables.join(", ")}`
        );
    }

    return template.replace(/\${(.*?)}/g, (_: string, variableName: string) => {
        return variables[variableName as keyof MessageVariables[K]] || `{{${variableName}}}`;
    });
}
