import app from "../../src/app.js";
import request from "supertest";

export function createAuthAgent(token: string) {
    // supertest.agent allows us to reuse cookies, headers...
    const agent = request.agent(app);

    // attach Authorization header for all requests
    agent.set("Authorization", `Bearer ${token}`);

    return agent;
}