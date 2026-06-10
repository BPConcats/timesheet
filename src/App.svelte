<script>
    import { onMount } from 'svelte';
    import TabBar from './lib/TabBar.svelte';
    import Timer from './lib/Timer.svelte';
    import Toolbar from './lib/Toolbar.svelte';
    import History from './pages/History.svelte';
    import Reports from './pages/Reports.svelte';
    import Settings from './pages/Settings.svelte';
    import Today from './pages/Today.svelte';
    import { localDir } from './stores/routeStore';
    import { getSetting } from './stores/settingsStore';

    let dir = window.location.hash;
</script>

{#if dir == '#timer'}
  <Timer/>
{:else}
  <Toolbar/>

  {#if $localDir != 'settings'}
    <TabBar/>
  {/if}

  {#if $localDir == 'today'}
    <Today/>
  {:else if $localDir == 'history'}
    <History/>
  {:else if $localDir == 'reports'}
    <Reports/>
  {:else if $localDir == 'settings'}
    <Settings/>
  {/if}
{/if}

<style>
</style>
