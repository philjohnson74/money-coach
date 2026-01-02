import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { EnabledFeatures, EnabledFeaturesResponse } from '../types';

const http: AxiosInstance = axios.create({
    baseURL: 'https://money-coach-api-828818752472.us-central1.run.app',
});

export async function getEnabledFeatures(partnerId: string): Promise<EnabledFeatures> {
    const url = `/api/partners/${partnerId}/features`;
    const response: AxiosResponse<EnabledFeaturesResponse> = await http.get<EnabledFeaturesResponse>(url);
    
    const enabledFeatureNames = Object.entries(response.data.features)
        .filter(([_, status]) => status === 'enabled')
        .map(([featureName]) => featureName);
    
    return {
        partnerId: response.data.partnerId,
        enabledFeatureNames,
    };
}

