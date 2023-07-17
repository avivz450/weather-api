import axios, { AxiosRequestConfig } from 'axios';

export async function makeHttpRequest(correlationId: string, url: string, method: string, params: any): Promise<any> {
    const methodName = 'makeHttpRequest';
    logger.info(correlationId, `${methodName} - Start`, { url, method, params });

    const config: AxiosRequestConfig = {
        url,
        method,
        params
    };

    try {
        const response = await axios.request(config);
        logger.info(correlationId, `${methodName} - Request successful`);
        logger.info(correlationId, `${methodName} - End`);
        return response.data;
    } catch (error) {
        logger.err(correlationId, `${methodName} - Error:`, error.message);
        throw new Error(error.message);
    }
}
