'use strict'

Vue.component('timeline', {
	props: ['timeline', 'episode'],
	template: `<div class="timeline">
		<timeline-event-group v-for="eventGroup in timeline.eventGroups" 
							  :group="eventGroup" 
							  :seasons="timeline.seasons" 
							  :episode="episode" />
	</div>`	
});

Vue.component('timeline-event-group', {
	props: ['group', 'seasons', 'episode'],	
	template: `<div v-if="displayGroup" class="timeline-group">
			<p class="timeline-group-timemark">
				{{group.timeMark}}
			</p>
			<div class="timeline-group-container">
				<template v-for="(event, index) in displayedEvents">
					<transition name="appear">						
						<timeline-event :event="event" 
										:seasons="seasons" 
										:class="{ 'highlighted' : highlight(event) }" />
					</transition>
				</template>
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
			return this.episode.seasonNumber > event.seasonNumber 
				   || (this.episode.seasonNumber == event.seasonNumber && this.episode.episodeNumber >= event.episodeNumber);
		}
	},
});

Vue.component('timeline-event', {
	props: ['event', 'seasons'],
	template: `<div class="timeline-event">
			<div v-if="event.imgName" class="timeline-event-image">
				<img :src="'images/' + event.imgName" />
			</div>
			<label class="timeline-event-episode">
				Season <b>{{event.seasonNumber}}</b>
				Episode <b>{{event.episodeNumber}}</b>
			</label>
			<p class="timeline-event-text">{{event.text}}</p>
		</div>`	
});

Vue.component('episode-selector', {
	props: ['value', 'seasons'],
	template: `<div class="episode-selector">
			<div class="episode-selector-season" v-for="(season, seasonIndex) in seasons">
				<h3>Season {{season.number}}</h3>
				<div class="episode-selector-episodes">
					<button class="btn btn-light" v-for="(episode, episodeIndex) in season.episodes" 
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
			this.$emit('input', { seasonNumber, episodeNumber} );
		}
	}
});

var app = new Vue({
	el: '#app',
	data() {
		return {
			timeline: window.timeline,
			episode: {
				seasonNumber: 1,
				episodeNumber: 1
			}
		}
	}
});