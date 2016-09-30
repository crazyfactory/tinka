import IHttpClientConfiguration = HttpClient.IHttpClientConfiguration;
export class HttpClientConfiguration implements IHttpClientConfiguration{
    defaults: HttpClient.IHttpClientRequestOptions;
    private base_url:string;
    withBaseUrl(url: string): HttpClient.IHttpClientConfiguration {
        this.base_url = url;
        return this;
    }

}