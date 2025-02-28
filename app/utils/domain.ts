import { isProduction } from "@/utils/environment";

export function getApiDomain(): string {
  const prodUrl = process.env.NEXT_PUBLIC_PROD_API_URL ||
    "https://root-beacon-451315-r0.oa.r.appspot.com"; 

  const devUrl = "http://localhost:8080"; // Use local backend in development

  return isProduction() ? prodUrl : devUrl;
}
