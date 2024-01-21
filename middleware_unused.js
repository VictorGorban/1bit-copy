import { NextResponse } from 'next/server'

//* Из-за serverless архитектуры Nextjs, в middleware и импортируемых здесь файлах нельзя юзать nodejs модули.
export async function middleware(req) {
    try {
        req.body = await req.json(); // нельзя изменять req.body
    } catch (e) {
        // скорее всего, req.body не в формате json
        console.log('cannot parse request as json', req.url)
    } finally {
    }
}

export const config = {
    matcher: '/api',
}

