export default (angularHttpClient: any) => (url: string, params: { 
    headers: Record<string, string>, 
    method: "GET" | "POST" | "PUT", 
    body?: string 
}) => {
    const { headers, method, body } = params;
    const options = { headers, observe: 'response', responseType: 'text' };

    const buildResponse = (response: any, ok: boolean) => {
        const { status, headers, body, error, message } = response;
        return {
            status: status ?? (ok ? 200 : 500),
            ok,
            headers: { get: (name: string) => headers?.get?.(name) ?? null },
            text: () => Promise.resolve(body ?? error ?? message ?? ''),
        };
    };

    return new Promise((resolve) => {
        const onNext  = (res: any) => resolve(buildResponse(res, res.status ? res.status >= 200 && res.status < 300 : true));
        const onError = (err: any) => resolve(buildResponse(err, false));
        switch (method) {
            case "GET":
                return angularHttpClient.get(url, options).subscribe(onNext, onError);
            case "POST":
                return angularHttpClient.post(url, body ?? '', options).subscribe(onNext, onError);
            case "PUT":
                return angularHttpClient.post(url, body ?? '', options).subscribe(onNext, onError);
            default:
                return onError({ status: 405, message: `Unsupported method: ${method}` });
        }   
    });
};
