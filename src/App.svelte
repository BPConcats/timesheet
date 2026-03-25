<script>
    import { onMount } from 'svelte';
    import TabBar from './lib/TabBar.svelte';
    import Toolbar from './lib/Toolbar.svelte';
    import Timer from './lib/Timer.svelte';
    import { activities, getAllActivities, startNewActivity, updateActivity } from './stores/activityStore';
    import { formatSeconds } from "./common";
    import ActivityItem from './lib/ActivityItem.svelte';
    import { parse } from 'svelte/compiler';

    let dir = window.location.hash;

    let allActivities = [];
    let todaysActivities = [];
    let monthActivities = [];
    let totalTime = 0;
    let billableTime = 0;

    onMount(()=>{
      window.electronAPI.on("start-activity", (activity) => {
        startNewActivity();
      });

      window.electronAPI.on("save-close", (activity) => {
        updateActivity(activity);
      });
    });

    $: if($activities) {
      allActivities = getAllActivities();
      todaysActivities = allActivities.filter((a) => new Date(Date.parse(a.dateCreated)).toDateString() == new Date().toDateString());
      monthActivities = allActivities.filter((a) => new Date(Date.parse(a.dateCreated)).getMonth() == new Date().getMonth() && new Date(Date.parse(a.dateCreated)).getFullYear() == new Date().getFullYear());
      totalTime = monthActivities.map(a => a.timeOnTask).reduce((sum, current) => sum + current, 0);
      billableTime = monthActivities.map(a => a.type == 'billable' ? a.timeOnTask : 0).reduce((sum, current) => sum + current, 0);
    }
</script>

{#if dir == '#timer'}
  <Timer/>
{:else}
  <Toolbar/>
  <TabBar/>
  <section class="stats">
    <div class="panel">
      <div class="row" style="justify-content: space-between;">
        <p class="title">TOTAL</p>
        <i class="statsIcon fa-solid fa-clock" style="border: 1px solid var(--blue); color: var(--blue); background-color: var(--faded-blue);"></i>
      </div>
      <h3>{formatSeconds(totalTime)}</h3>
    </div>
    <div class="panel">
      <div class="row" style="justify-content: space-between;">
        <p class="title">BILLABLE</p>
        <i class="statsIcon fa-solid fa-dollar-sign" style="border: 1px solid var(--green); color: var(--green); background-color: var(--faded-green);"></i>
      </div>
      <h3>{formatSeconds(billableTime)}</h3>
    </div>
    <div class="panel">
      <div class="row" style="justify-content: space-between;">
        <p class="title">NON-BILL</p>
        <i class="statsIcon fa-solid fa-coffee" style="border: 1px solid var(--grey); color: var(--grey); background-color: var(--faded-grey);"></i>
      </div>
      <h3>{formatSeconds(monthActivities.map(a => a.type != 'billable' ? a.timeOnTask : 0).reduce((sum, current) => sum + current, 0))}</h3>
    </div>
    <div class="panel">
      <div class="row" style="justify-content: space-between;">
        <p class="title">BILL PERC.</p>
        <i class="statsIcon fa-solid fa-percent" style="border: 1px solid var(--orange); color: var(--orange); background-color: var(--faded-orange);"></i>
      </div>
      <h4>{totalTime == 0 ? 0 : parseInt((billableTime / totalTime) * 100)}%</h4>
    </div>
  </section>

  <section class="col activities" style="flex: 1">
    <div class="col panel" style="padding: 0px; gap: 10px; flex: 1; width: 100%; justify-content: start;">
      <div class="row" style="padding: 10px; padding-bottom: 0px; margin-bottom: -10px; font-size: medium; justify-content: space-between; width: 100%;">
        <h4>Today's Activities</h4>
      </div>
      <hr/>
      <div class="col" style="max-height: 300px; overflow-y: auto; gap: 0px;">
        {#each todaysActivities.filter((a) => a.description).reverse() as activity}
          <ActivityItem activity={activity}></ActivityItem>
        {/each}
      </div>
    </div>
  </section>
{/if}

<style>
  .statsIcon {
    padding: 8px;
    border-radius: 8px; font-size: small;
    width: 35px;
    height: 35px;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  section {
    padding: 15px;
    padding-top: 4px;
  }

  .activities .panel {
    width: 100%;
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 10px;
    width: 100vw;
  }

  .panel .title {
    font-size: small;
    color: var(--faded-text);
  }
</style>
