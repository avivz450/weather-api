import axios, { AxiosRequestConfig } from 'axios';

export async function makeHttpRequest(url: string, method: string, params: any): Promise<any> {
    const config: AxiosRequestConfig = {
    url,
    method,
    params
    };

    try {
        const response = await axios.request(config);
        return response.data;
    } catch (error) {
        throw new Error(error.message);
    }
}