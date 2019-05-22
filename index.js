'use strict'

var Timeline = Vue.component('timeline', {
    props: ['timeline', 'episode'],
    template: `<div class="timeline">
        <timeline-event-group v-for="eventGroup in timeline.eventGroups" 
                              :key="eventGroup.timeMark"
                              :group="eventGroup" 
                              :seasons="timeline.seasons" 
                              :episode="episode" />
    </div>`
});

var TimelineEventGroup = Vue.component('timeline-event-group', {
    props: ['group', 'seasons', 'episode'],
    template: `<div v-if="displayGroup" class="timeline-group">
            <div class="timeline-group-timemark">
                {{group.timeMark}}
            </div>
            <div class="timeline-group-container">
                
                    <timeline-event v-for="(event, index) in group.events"
                                    :key="'' + event.seasonNumber + event.episodeNumber + index"
                                    v-show="showEvent(event)"
                                    :event="event" 
                                    :seasons="seasons" 
                                    :class="{ 'highlighted' : highlight(event) }" />
                
            </div>
        </div>`,
    computed: {
        displayedEvents() {
            if (this.group && this.group.events)
                return this.group.events.filter(this.showEvent);
            return [];
        },
        displayGroup() {
            return this.displayedEvents.length > 0;
        }
    },
    methods: {
        highlight(event) {
            return this.episode.seasonNumber == event.seasonNumber && this.episode.episodeNumber == event.episodeNumber;
        },
        showEvent(event) {
            return this.episode.seasonNumber > event.seasonNumber ||
                (this.episode.seasonNumber == event.seasonNumber && this.episode.episodeNumber >= event.episodeNumber);
        }
    },
});

var TimelineEvent = Vue.component('timeline-event', {
    props: ['event', 'seasons'],
    template: `<transition name="appear">
        <div class="timeline-event">
            <label class="timeline-event-episode">
                Season <b>{{event.seasonNumber}}</b>
                Episode <b>{{event.episodeNumber}}</b>
            </label>
            <div class="timeline-event-text">{{event.text}}</div>
            <div v-if="event.imgName" class="timeline-event-image">
                <img :src="'images/' + event.imgName" />
            </div>
        </div>
    </transition>`
});

var EpisodeSelector = Vue.component('episode-selector', {
    props: ['value', 'seasons'],
    template: `<div class="episode-selector">
            <h3 class="episode-selector-callout">Select last seen episode</h3>
            <div class="episode-selector-season" v-for="(season, seasonIndex) in seasons">
                <h3 class="season-number">Season {{season.number}}</h3>
                <div class="episode-selector-episodes">
                    <button class="btn btn-light episode-btn" 
                            v-for="(episode, episodeIndex) in season.episodes"
                            type="button" 
                            @click="selectEpisode(season.number, episode.number)"
                            :class="{'selected':value.seasonNumber == season.number && value.episodeNumber == episode.number }">
                        {{episode.number}}
                    </button>
                </div>
            </div>
        </div>`,
    methods: {
        selectEpisode(seasonNumber, episodeNumber) {
            this.$emit('input', {
                seasonNumber,
                episodeNumber
            });
        }
    }
});

var app = new Vue({
    el: '#app',
    template: `<div class="app container">
        <div class="header">
            <div class="header__logo"></div>
            <h1 class="header__text">Westworld</h1>
            <div class="header__text-timeline">Timeline</div>
        </div>
        <episode-selector v-model="episode" :seasons="timeline.seasons" @input="scrollToTimeline" />
        <timeline :timeline="timeline" :episode="episode" />
    </div>`,
    components: {
        Timeline,
        EpisodeSelector
    },
    data() {
        return {
            timeline: window.timeline,
            episode: {
                seasonNumber: 1,
                episodeNumber: 1
            }
        }
    },
    watch: {
        episode() {
            this.scrollToTimeline();
        }
    },
    methods: {
        scrollToTimeline() {
            //document.getElementById("timeline").scrollIntoView();
        }
    }
});