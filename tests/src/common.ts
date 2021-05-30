import { Config, InstallAgentsHapps } from "@holochain/tryorama";
import { InstallAppRequest } from "@holochain/conductor-api";
import path from "path";

export const conductorConfig = Config.gen({});
export const Coherence_Zome = "coherence";

export const coherenceDNA = path.join(
    __dirname,
    "../../workdir/dna/coherence.dna"
);

const installationAgents: InstallAgentsHapps = [
    // agent 0
    [
        // happ 0
        [coherenceDNA],
    ],
    [
        // happ 0
        [coherenceDNA],
    ],
];

export const InstallAgentApp = async (s, agentName: string) => {
    const config = Config.gen();
    const [agent] = await s.players([conductorConfig], false);
    await agent.startup();
    const adminWs = agent.adminWs();
    const agent_key = await adminWs.generateAgentPubKey();
    const hash_app = await adminWs.registerDna({
        path: coherenceDNA,
    });

    const req: InstallAppRequest = {
        installed_app_id: `coherence-app-` + agentName,
        agent_key: agent_key,
        dnas: [
            {
                hash: hash_app,
                nick: "my_cell_" + agentName,
            },
        ],
    };
    const installedHapp = await agent._installHapp(req);

    return installedHapp.cells[0];
};


export const _log = (key, value) => {
    console.log("######(" + key + ")#############");
    console.log(value);
    console.log("-----------------------------------");
};
