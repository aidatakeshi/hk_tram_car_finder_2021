<script>

const func = require('../function.js');
import axios from 'axios';

export default {
    data(){
        return {
            noOfStops: 0,
            progress: 0,
            isLoading: false,
            stops: {},
            result_tram: {},
            tram_nos: [],
        };
    },

    async mounted(){
        this.stops = await func.getTramStops(axios);
        this.noOfStops = Object.keys(this.stops).length;
    },

    methods:{
        getDisplayTime: func.getDisplayTime,
        getDisplaySeconds: func.getDisplaySeconds,
        stringReplace: func.stringReplace,

        async loadData(){
            this.progress = 0;
            this.isLoading = true;
            this.result_tram = {};
            this.tram_nos = [];

            //For each stop
            for (var stop_id in this.stops){
                var result = await func.getTramETAOfStop(axios, stop_id);
                for (var eta of result){
                    var tram_id = eta.tram_id;
                    var updated = func.dayjs().valueOf();
                    var timestamp = func.dayjs().valueOf() + 1000 * eta.arrive_in_second * 1
                    //Check if arrive_in_second valid (within 20 minutes)
                    if (Math.abs(eta.arrive_in_second * 1) > 1200) continue;
                    //Add to result if not exists
                    if (!this.result_tram[tram_id]){
                        this.result_tram[tram_id] = eta;
                        this.result_tram[tram_id].stop_id = stop_id;
                        this.result_tram[tram_id].updated = updated;
                        this.result_tram[tram_id].timestamp = timestamp;
                    }
                    //Add to result if timestamp earlier
                    else{
                        if (this.result_tram[tram_id].timestamp > timestamp){
                            this.result_tram[tram_id] = eta;
                            this.result_tram[tram_id].stop_id = stop_id;
                            this.result_tram[tram_id].updated = updated;
                            this.result_tram[tram_id].timestamp = timestamp;
                        }
                    }
                    //Push to tram_nos
                    if (this.tram_nos.indexOf(tram_id) == -1){
                        this.tram_nos.push(tram_id);
                        this.sortTramNos();
                    }
                }
                //Increase progress
                this.progress++;
            }

            //Finish
            this.sortTramNos();
            this.isLoading = false;
        },

        sortTramNos(){
            this.tram_nos.sort(function(a, b){
                return a * 1 - b * 1;
            });
        },
    },
}

</script>

<template>
    <div class="container">

        <!-- Top Bar -->
        <b-navbar toggleable="lg" type="dark" variant="dark">
            <b-navbar-brand>Tram Finder</b-navbar-brand>
        </b-navbar>

        <!-- Load Data -->
        <div class="my-4 d-flex justify-content-center">
            <b-button variant="success" block style="max-width: 20em;" @click="loadData()" :disabled="isLoading">
                Load Data
            </b-button>
        </div>

        <div v-if="isLoading" class="my-2">
            <div>Progress: {{progress}} / {{noOfStops}} ({{(100*progress/noOfStops).toFixed(1)}}%)</div>
            <b-progress :max="noOfStops" height="2rem" v-if="isLoading || true">
                <b-progress-bar :value="progress" variant="info"></b-progress-bar>
            </b-progress>
        </div>

        <!-- Result -->
        <table class="table table-bordered my-table text-center">
            <thead class="thead-light">
                <tr>
                    <th>No.</th>
                    <th>Stop</th>
                    <th>Bound For</th>
                    <th>E.T.A.</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="tram_id of tram_nos" :key="tram_id">
                    <td class="py-0 align-middle" style="font-size: 1.4em;">
                        {{tram_id}}
                    </td>
                    <td class="py-0 align-middle">
                        <small>{{stringReplace(stops[(result_tram[tram_id]||{}).stop_id].en)}}</small>
                        <br/>
                        {{stringReplace(stops[(result_tram[tram_id]||{}).stop_id].tc)}}
                        <small>({{(result_tram[tram_id]||{}).stop_id}})</small>
                    </td>
                    <td class="py-0 align-middle dest"
                    :class="`dest-${(result_tram[tram_id]||{}).dest_stop_code}`">
                        <small>{{stringReplace((result_tram[tram_id]||{}).tram_dest_en)}}</small>
                        <br/>
                        {{stringReplace((result_tram[tram_id]||{}).tram_dest_tc)}}
                    </td>
                    <td class="py-0 align-middle" style="vertical-align: middle; line-height: 1em;">
                        <span style="font-size: 1.2em;">{{getDisplayTime((result_tram[tram_id]||{}).timestamp)}}</span><!---
                    ---><small style="color: #666;">:{{getDisplaySeconds((result_tram[tram_id]||{}).timestamp)}}</small>
                        <br/>
                        <small style="color: #ccc;">
                            Updated: {{getDisplayTime((result_tram[tram_id]||{}).updated, true)}}
                        </small>
                    </td>
                </tr>
            </tbody>
        </table>

        <!---------------------------------------------------------------------------------------->

    </div>
</template>

<style scoped>
.my-table thead th{
    padding: 0.5rem 0.25rem;
    text-align: center;
    vertical-align: middle;
    white-space: nowrap;
}
.my-table tbody th{
    padding: 0.25rem;
    text-align: center;
    vertical-align: middle;
    white-space: nowrap;
}
.my-table tbody td{
    padding: 0.25rem;
    text-align: center;
    vertical-align: middle;
    white-space: nowrap;
}
@media screen and (max-width: 1000px) {
    .my-table{
        font-size: 0.85em;
    }
}
@media screen and (max-width: 750px) {
    .my-table{
        font-size: 0.75em;
    }
}

.dest{
    font-weight: bold;
    background-color: grey;
    color: white;
}
.dest-CBT{
    background-color: yellow;
    color: #900;
}
.dest-NPT{
    background-color: red;
    color: #ffc;
}
.dest-WST{
    background-color: red;
    color: #ffc;
}
.dest-KTT{
    background-color:green;
    color: #ffc;
}
.dest-HVT_B{
    background-color:green;
    color: #ffc;
}
.dest-HVT_K{
    background-color:green;
    color: #ffc;
}
.dest-SKT{
    background-color:blue;
    color: #ffc;
}
.dest-WMT{
    background-color:blue;
    color: #ffc;
}
.dest-WD{
    background-color: yellow;
    color: black;
}
.dest-ED{
    background-color: yellow;
    color: black;
}
</style>