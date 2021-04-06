class Scheduler {
    private interval;

    scheduleJob(time: number, callback: CallableFunction) {
        clearInterval(this.interval)

        callback();
        this.interval = setInterval(() => {
            callback();
        }, time);
    }
}

export default Scheduler;