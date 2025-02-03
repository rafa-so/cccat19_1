import axios from "axios";

export default interface HttpClient {
    get(url: string): Promise<any>;
    post(url: string, data: any): Promise<any>;
}

export class AxiosAdapter implements HttpClient {
    async post (url: string, data: any) {
        const response = await axios.post(url, data);
        return response.data;
    }

    async get(url: string) {
        const response = await axios.get(url);
        return response .data;
    }
}

export class FetchAdapter implements HttpClient {
    async post (url: string, data: any) {
        const response = await fetch(url, { 
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(data)
        });
        return response.json();
    }

    async get(url: string) {
        const response = await fetch(url);
        return response.json();
    }
}