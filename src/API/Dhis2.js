const DHIS2_URL = window.location.origin.split(":")[2] === '3000' ? "http://localhost/api" : window.location.href.split("/apps")[0]


export function post(url, body){
            return fetch(DHIS2_URL+url, {
                method: "POST",
                credentials: 'include',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json'
                },
            }).then(response => response.json());
    }    
export function get(url){
            return fetch(DHIS2_URL+url, {
                method: "GET",
                credentials: 'include'
            }).then(response => response.json())
        }
