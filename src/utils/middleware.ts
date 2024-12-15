import { Request, Response, NextFunction } from 'express'

export function apiKeyMiddleware(request: Request, response: Response, next: NextFunction) {
    if (request.path.startsWith('/dialogflow')) {
        const authHeader = request.get('Authorization')
        if (!authHeader) {
            console.log(`❌ No Authorization header found`)
            return response.status(401).json({ error: 'Missing Authorization header' })
        }
        const [bearer, token] = authHeader.split(' ')
        if (bearer !== 'Bearer' || !token) {
            console.log(`❌ Invalid Authorization format`)
            return response.status(401).json({ error: 'Invalid Authorization format' })
        }
        if (token !== process.env.API_KEY) {
            console.log(`❌ Invalid API key`)
            return response.status(401).json({ error: 'Invalid API key' })
        }
    }
    next()
}
