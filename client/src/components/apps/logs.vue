<template>
    <div class="logs-container">
        <v-tabs class="console-bar" style="position: relative;">
            <v-tab v-if="logType == 'runlogs'" @click="getLogHistory('web')">run</v-tab>
            <v-tab v-if="logType == 'runlogs' && hasAddons" @click="getLogHistory('addons')">addons</v-tab>
            <v-tab v-if="logType == 'runlogs' && deploymentstrategy == 'git' && buildstrategy=='plain'" @click="getLogHistory('builder')">build</v-tab>
            <v-tab v-if="logType == 'runlogs' && deploymentstrategy == 'git' && buildstrategy=='plain'" @click="getLogHistory('fetcher')">fetch</v-tab>
            <v-tab v-if="logType == 'buildlogs'" @click="getBuildLogHistory('fetch')">fetch</v-tab>
            <v-tab v-if="logType == 'buildlogs' && (buildstrategy=='nixpacks' || buildstrategy=='buildpacks')" @click="getBuildLogHistory('build')">build</v-tab>
            <v-tab v-if="logType == 'buildlogs' && (buildstrategy=='nixpacks' || buildstrategy=='dockerfile')" @click="getBuildLogHistory('push')">push</v-tab>
            <v-tab v-if="logType == 'buildlogs'" @click="getBuildLogHistory('deploy')">deploy</v-tab>
        </v-tabs>
        <div v-if="currentTab == 'addons' && addonInstances.length > 0" class="addon-filter">
            <v-select
                v-model="selectedAddon"
                :items="addonItems()"
                :label="$t('app.actions.addonFilter')"
                density="compact"
                variant="outlined"
                hide-details
                class="pa-2"
            ></v-select>
        </div>
        <div class="console" id="console">
            <div v-for="line in visibleLines" :key="line.id">
            {{ new Date(line.time).toLocaleDateString() }} {{ new Date(line.time).toLocaleTimeString()}} <span :style="'color:' +line.color">[{{ lineLabel(line) }}]</span>
            {{ line.log }}
            </div>
            <span style="margin: 25px;"></span>
        </div>
    </div>
</template>


<script lang="ts">
import axios from "axios";
import { ref, reactive, defineComponent, computed } from 'vue'
import { useKuberoStore } from '../../stores/kubero'

type LogLine = {
    app: string;
    container: string;
    id: string;
    log: string;
    phase: string;
    pipeline: string;
    pod: string;
    podID: string;
    time: number;
    color: string;
}

type AddonInstance = {
    name: string;
    displayName: string;
}

const socket = useKuberoStore().kubero.socket as any;
const loglines = ref([] as LogLine[]);
// pestaña activa: las líneas en vivo son de los pods de la app, solo van en "web"
const currentTab = ref('web');

socket.on('log', (data: LogLine) => {
    //console.log("log", data);
    if (currentTab.value == 'web') {
        loglines.value.unshift(data)
    }
});


export default defineComponent({
    setup(props) {
        // addon seleccionado en la pestaña addons ("all" = todos)
        const selectedAddon = ref('all');
        // la popup no recibe la lista de addons, así que se carga desde la app
        const loadedAddons = ref([] as any[]);

        // nombre de la instancia (prefijo de sus pods) y nombre a mostrar
        const addonInstances = computed((): AddonInstance[] => {
            const addons = props.addons.length > 0 ? props.addons : loadedAddons.value;
            return addons.map((addon: any) => {
                const crd = addon.resourceDefinitions?.[addon.kind]
                    ?? Object.values(addon.resourceDefinitions || {}).find((r: any) => r?.kind !== 'Secret');
                return {
                    name: crd?.metadata?.name as string,
                    displayName: (addon.displayName || addon.kind) as string,
                };
            }).filter((addon: AddonInstance) => !!addon.name);
        });

        // el addon con el prefijo más largo gana (evita que "app-pg" se confunda con "app-pg-2")
        const addonForPod = (podName: string): AddonInstance | undefined => {
            let match: AddonInstance | undefined;
            for (const addon of addonInstances.value) {
                if (podName.startsWith(addon.name + '-') && (!match || addon.name.length > match.name.length)) {
                    match = addon;
                }
            }
            return match;
        };

        const visibleLines = computed((): LogLine[] => {
            if (currentTab.value != 'addons' || selectedAddon.value == 'all') {
                return loglines.value;
            }
            return loglines.value.filter((line) => addonForPod(line.pod)?.name == selectedAddon.value);
        });

        return {
            loglines,
            currentTab,
            socket,
            selectedAddon,
            loadedAddons,
            addonInstances,
            addonForPod,
            visibleLines,
        }
    },
    mounted() {
        if (this.logType == 'buildlogs')  {
            this.getBuildLogHistory('fetch')
            //this.socketJoin()
            //this.startLogs()
        } else {
            if (this.logType == 'runlogs' && this.hasAddons && this.addons.length == 0) {
                axios.get(`/api/apps/${this.pipeline}/${this.phase}/${this.app}`).then((response) => {
                    this.loadedAddons = response.data.spec.addons || [];
                });
            }
            this.getLogHistory('web')
            this.socketJoin()
            this.startLogs()
            socket.on('connect', this.onSocketConnect)
        }
    },
    unmounted() {
        socket.off('connect', this.onSocketConnect)
        this.socketLeave()
        this.loglines = []
    },
    props: {
      pipeline: {
        type: String,
        default: "MISSING"
      },
      phase: {
        type: String,
        default: "MISSING"
      },
      app: {
        type: String,
        default: "new"
      },
      deploymentstrategy: {
        type: String,
        default: "docker"
      },
      buildstrategy: {
        type: String,
        default: "dockerfile"
      },
      logType: {
        type: String,
        default: "runlogs"
      },
      buildID: {
        type: String,
        default: "MISSING"
      },
      height: {
        type: String,
        default: "100%"
      },
      hasAddons: {
        type: Boolean,
        default: false
      },
      addons: {
        type: Array,
        default: () => []
      },
    },
    data: () => ({
        loglines: [
            /* example
            {
                app: "bla"
                container: "kuberoapp-web"
                id: "049464b6-3f35-4b72-a885-6c263e64aec7"
                log: "logtest: nana\n"
                phase: "production"
                pipeline: "hoho"
                pod: "bla-kuberoapp-web-6dfd5c4c9b-mxg9v"
                podID: "6dfd5c4c9b-mxg9v"
                time: 1656970421989
            },
            */
        ] as LogLine[],
    }),
    methods: {
        addonItems() {
            return [
                { title: this.$t('app.actions.allAddons'), value: 'all' },
                ...this.addonInstances.map((addon: AddonInstance) => ({ title: addon.displayName, value: addon.name })),
            ];
        },
        lineLabel(line: LogLine) {
            const addon = this.addonForPod(line.pod);
            if (addon) {
                return `${addon.displayName}/${line.container}`;
            }
            if (this.currentTab == 'addons') {
                return `${line.pod.replace(this.app + '-', '')}/${line.container}`;
            }
            return `${line.podID}/${line.container.replace('kuberoapp-', '')}`;
        },
        socketJoin() {
            console.log("socketJoin", `${this.pipeline}-${this.phase}-${this.app}`);
            socket.emit("join", {
                room: `${this.pipeline}-${this.phase}-${this.app}`,
            });
        },
        socketLeave() {
            console.log("socketLeave", `${this.pipeline}-${this.phase}-${this.app}`);
            socket.emit("leave", {
                room: `${this.pipeline}-${this.phase}-${this.app}`,
            });
        },
        onSocketConnect() {
            // al reconectar, el socket nuevo no está en la sala: hay que volver a entrar
            this.socketJoin();
            this.startLogs();
            this.getLogHistory(this.currentTab);
        },
        startLogs() {
            axios.get(`/api/logs/${this.pipeline}/${this.phase}/${this.app}`).then(() => {
                console.log("logs started");
            });
        },
        getLogHistory(container: string) {
            this.currentTab = container;
            axios.get(`/api/logs/${this.pipeline}/${this.phase}/${this.app}/${container}/history`).then((response) => {
                this.loglines = response.data;
            });
        },
        getBuildLogHistory(container: string) {
            //http://localhost:2000/api/deployments/devcon/production/aaa/20240717-0651/log
            axios.get(`/api/deployments/${this.pipeline}/${this.phase}/${this.app}/${this.buildID}/${container}/history`).then((response) => {
                if (response.data.length > 0) {
                    this.loglines = response.data;
                } else {
                    this.loglines = [{
                        app: "container",
                        container: "debug",
                        id: "00000000-0000-0000-0000-000000000000",
                        log: "No logs available",
                        phase: "",
                        pipeline: "",
                        pod: "",
                        podID: "error",
                        color: "#FF0000",
                        time: Date.now(),
                    }];
                }
            });
        },
    },
});
</script>

<style lang="scss">

a:link { text-decoration: none;}
.v-icon.v-icon {
    vertical-align:inherit;
}

.logs-container {
    /*height: calc(100vh - 400px);*/
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
}

.v-tabs.console-bar {
    color: #9F9F9F;
    background-color: #16202D;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    flex-shrink: 0;
}

.console {
    flex: 1;
    overflow-x: auto;
    overflow-y: auto;
    background-color: #0B1119;
    color: #E2E8F0;
    padding: 10px;
    font-family: "Fira Code", SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 0.8125rem;
    line-height: 1.5;
    border: 1px solid rgba(135, 135, 135, 0.2);
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    display: flex;
    flex-direction: column-reverse;
    min-height: 0;
}
</style>