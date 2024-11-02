// src/utils/fetchAPI.js

const fetchAPI = async (url, method = "GET", body = null) => {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(url, options);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "API request failed");
  }
  return await response.json();
};

export default fetchAPI;
