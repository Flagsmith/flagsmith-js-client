export default (angularHttpClient:any)=> (url: string, params: { headers: Record<string, string>, method: "GET" | "POST" | "PUT", body: string }) => {
    const {headers, method, body} = params
    return new Promise((resolve) => {
        switch (method) {
            case "GET": {
                return angularHttpClient.get(url, {
                    headers,
                }).subscribe((v:string) => {
                    resolve({
                        ok: true,
                        text: () => Promise.resolve(v)
                    })
                })
            }
            case "POST": {
                return angularHttpClient.post(url, body, {
                    headers,
                }).subscribe((v:string) => {
                    resolve({
                        ok: true,
                        text: () => Promise.resolve(v)
                    })
                })
            }
            case "PUT": {
                return angularHttpClient.post(url, body, {
                    headers,
                }).subscribe((v:string) => {
                    resolve({
                        ok: true,
                        text: () => Promise.resolve(v)
                    })
                })
            }
        }
    })
}
