export default (angularHttpClient:any)=> (url: string, params: { headers: Record<string, string>, method: "GET" | "POST" | "PUT", body: string }) => {
    const {headers, method, body} = params
    const options = { headers, observe: 'response' as const, responseType: 'text' as const }
    return new Promise((resolve) => {
        const handleResponse = (res:any) => resolve({
            status: res.status,
            ok: true,
            headers: { get: (name:string) => res.headers?.get(name) },
            text: () => Promise.resolve(res.body)
        })
        const handleError = (err:any) => resolve({
            status: err.status || 500,
            ok: false,
            headers: { get: (name:string) => err.headers?.get(name) || null },
            text: () => Promise.resolve(err.error || err.message || 'Unknown error')
        })
        switch (method) {
            case "GET":
                return angularHttpClient.get(url, options).subscribe(handleResponse, handleError)
            case "POST":
                return angularHttpClient.post(url, body, options).subscribe(handleResponse, handleError)
            case "PUT":
                return angularHttpClient.put(url, body, options).subscribe(handleResponse, handleError)
        }
    })
}
