<script>
    import { onMount } from "svelte";
    import { formatSeconds } from "../common";

    let timeOnTask = 0;
    let paused = false;

    onMount(() => {
        window.electronAPI.send("start-activity", {});

        setInterval(() => {
            if(!paused) {
                timeOnTask += 1;
            }
        }, 1000);
    });

    function stopTimer() {
        close();
    }

    function close() {
        window.electronAPI.closeTimer();
    }
</script>

<section class="col">
    <div class="row" style="justify-content: space-between;">
        <h2>{formatSeconds(timeOnTask)}</h2>
        <div class="row">
            <i on:click={paused = !paused} class="fa-solid {paused ? "fa-play" : "fa-pause"}" style="padding: 8px; border: 1px solid var(--orange); color: var(--orange); background-color: var(--faded-orange); border-radius: 8px; font-size: small;"></i>
            <i on:click={stopTimer} class="fa-solid fa-square" style="padding: 8px; border: 1px solid var(--red); color: var(--red); background-color: var(--faded-red); border-radius: 8px; font-size: small;"></i>
        </div>
    </div>
</section>

<style>
    section {
        height: 100%;
        width: 100%;
        padding: 0px 10px;
        justify-content: center;
        -webkit-app-region: drag;
    }

    i {
        -webkit-app-region: none;
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }
</style>