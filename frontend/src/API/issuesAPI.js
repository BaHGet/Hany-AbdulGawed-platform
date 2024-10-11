const issuesApi = 'https://hany-server.netlify.app/.netlify/functions/api/issues'

export const getAll = async () => {
    let optiones = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };
    try {
        await fetch(issuesApi, optiones).then((res) => res.json());
    } catch (err) {
        console.error(err, "catch in IssuesAPI>getAll");
    }
}

export const getSpecific = async (id) => {
    let optiones = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };
    try {
        await fetch(`${issuesApi}/${id}`, optiones).then((res) => res.json());
    } catch (err) {
        console.error(err, "catch in IssuesAPI>getSpecific");
    }
}

export const createIssue = async (data) => {
    let optiones = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };
    try {
        await fetch(issuesApi, optiones).then((res) => res.json());
    } catch (err) {
        console.error(err, "catch in IssuesAPI>createIssue");
    }
}

export const deleteIssue = async (id) => {
    let optiones = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    };
    try {
        await fetch(`${issuesApi}/${id}`, optiones).then((res) => res.json());
    } catch (err) {
        console.error(err, "catch in IssuesAPI>deleteIssue");
    }
}