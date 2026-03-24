<script>
    import { onMount } from 'svelte';
    import TabBar from './lib/TabBar.svelte';
    import Toolbar from './lib/Toolbar.svelte';
    import Timer from './lib/Timer.svelte';
    import { activities, getAllActivities, startNewActivity, updateActivity } from './stores/activityStore';
    import { formatSeconds } from "./common";

    let dir = window.location.pathname;
    let allActivities = [];
    let todaysActivities = [];
    onMount(()=>{
      allActivities = getAllActivities();
      todaysActivities = allActivities.filter((a) => new Date(Date.parse(a.dateCreated)).toDateString() == new Date().toDateString())

      window.electronAPI.on("start-activity", (activity) => {
        startNewActivity();
      });

      window.electronAPI.on("save-close", (activity) => {
        updateActivity(activity);
      });
    });

    $: if($activities) {
      allActivities = getAllActivities();
      todaysActivities = allActivities.filter((a) => new Date(Date.parse(a.dateCreated)).toDateString() == new Date().toDateString())
    }
</script>

{#if dir == '/timer'}
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
      <h3>01:00:00</h3>
    </div>
    <div class="panel">
      <div class="row" style="justify-content: space-between;">
        <p class="title">BILLABLE</p>
        <i class="statsIcon fa-solid fa-dollar-sign" style="border: 1px solid var(--green); color: var(--green); background-color: var(--faded-green);"></i>
      </div>
      <h3>01:00:00</h3>
    </div>
    <div class="panel">
      <div class="row" style="justify-content: space-between;">
        <p class="title">NON-BILL</p>
        <i class="statsIcon fa-solid fa-coffee" style="border: 1px solid var(--grey); color: var(--grey); background-color: var(--faded-grey);"></i>
      </div>
      <h3>01:00:00</h3>
    </div>
    <div class="panel">
      <div class="row" style="justify-content: space-between;">
        <p class="title">PROGRESS</p>
        <i class="statsIcon fa-solid fa-percent" style="border: 1px solid var(--orange); color: var(--orange); background-color: var(--faded-orange);"></i>
      </div>
      <h4>50%</h4>
      <progress value="50" max="100" style="max-width: 100%;"></progress>
    </div>
  </section>

  <section class="col activities" style="flex: 1">
    <div class="col panel" style="padding: 0px; gap: 10px; flex: 1; width: 100%; justify-content: start;">
      <div class="row" style="padding: 10px; padding-bottom: 0px; margin-bottom: -10px; font-size: medium; justify-content: space-between; width: 100%;">
        <h4>Today's Activities</h4>
      </div>
      <hr/>
      <div class="col" style="max-height: 300px; overflow-y: scroll; gap: 0px;">
        <div>
        </div>
        {#each todaysActivities.filter((a) => a.description).reverse() as activity}
          <div class="activity row">
            <div class="row">
              <div style="border-radius: 999px; width: 10px; height: 10px; {activity.type == 'billable' ? "background-color: var(--green);" : activity.type == 'non-billable' ? "background-color: var(--blue);" : "background-color: var(--orange);"}"></div>
              <p style="max-width: 450px; max-lines: 1;">{activity.description}</p>
            </div>
            <div class="row">
              <p
                style="font-size: 12px;
                  padding: 0px 6px;
                  border-radius: 999px;
                  {activity.type == 'billable' ? "background-color: var(--faded-green);" : activity.type == 'non-billable' ? "background-color: var(--faded-blue);" : "background-color: var(--faded-orange);"}
                  {activity.type == 'billable' ? "border: 1px solid var(--green);" : activity.type == 'non-billable' ? "border: 1px solid var(--blue);" : "border: 1px solid var(--orange);"}
                  {activity.type == 'billable' ? "color: var(--green);" : activity.type == 'non-billable' ? "color: var(--blue);" : "color: var(--orange);"}
                "
              >{activity.type == 'billable' ? "Billable" : activity.type == 'non-billable' ? "Non-Billable" : "Misc."}</p>
              <p>{formatSeconds(activity.timeOnTask)}</p>
            </div>
          </div>
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

  .activity {
    justify-content: space-between;
    padding: 10px;
    align-items: center;
    border-bottom: 1px solid var(--border);
  }

  .activity:hover {
    background-color: var(--faded-border);
  }

  a {
    color: var(--green);
    font-weight: bold;
    cursor: pointer;
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
