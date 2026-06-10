<script>
    import PillToggle from "../lib/PillToggle.svelte";
    import { goToPrevDir } from "../stores/routeStore";
    import { getSetting, saveSetting } from "../stores/settingsStore";


</script>

<div style="padding: 12px; padding-top: 0px;">
    <i on:click={goToPrevDir} class="button fa-solid fa-arrow-left" style="font-size: larger; margin-top: 10px;"></i>
    <div class="setting-panels">
        <div class="panel">
            <h3>Timer Settings</h3>
            <hr style="margin-top: 0; margin-bottom: 10px;"/>
            <span class="row" style="justify-content: space-between;">
                <p>Always show timer description:</p>
                <PillToggle isToggled={getSetting('timer_description')} onToggle={(value) => saveSetting('timer_description', value)}/>
            </span>
        </div>
        <div class="panel">
            <h3>Misc. Settings</h3>
            <hr style="margin-top: 0; margin-bottom: 10px;"/>
            <span>
                <p></p>
            </span>
        </div>
    </div>
</div>

<style>
    .setting-panels {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
        gap: 20px;
        margin-top: 10px;
    }

    i.button {
        -webkit-app-region: none;
        color: var(--text);
        cursor: pointer;
    }

    i.button:hover {
        color: var(--faded-text);
    }

    .panel p {
        font-size: 16px;
    }
</style>
