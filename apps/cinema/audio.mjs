/**
 * Completely local synthesised soundtrack — no audio files or streaming services.
 * An AudioContext is created ONLY by an explicit user gesture (sound toggle).
 */
const NOTES={
  silence:55,void:55,ocean:73.4,archive:82.4,theatre:110,
  human:98,biome:130.8,reveal:65.4,museum:116.5,
  republic:92.5,trust:146.8,noise:61.7,convergence:123.4,
  secret:164.8,sunrise:174.6,air:98,finale:174.6
};
export class FilmSound {
  constructor(){this.context=null;this.master=null;this.ambient=null;this.toneGain=null;
    this.on=false;this.volume=.35;this.currentScene='silence'}
  async toggle(){
    if(this.on){await this.stop();return false}
    const Ctx=globalThis.AudioContext||globalThis.webkitAudioContext;
    if(!Ctx)return false;
    try{
      this.context=new Ctx();
      this.master=this.context.createGain();
      this.master.gain.setValueAtTime(this.volume*.085,this.context.currentTime);
      this.master.connect(this.context.destination);
      const lowpass=this.context.createBiquadFilter();
      lowpass.type='lowpass';lowpass.frequency.value=430;
      this.ambient=this.context.createOscillator();
      this.ambient.type='sine';this.ambient.frequency.value=NOTES[this.currentScene]||98;
      this.toneGain=this.context.createGain();this.toneGain.gain.value=.1;
      this.ambient.connect(lowpass);lowpass.connect(this.toneGain);
      this.toneGain.connect(this.master);
      this.ambient.start();
      await this.context.resume();
      this.on=true;this.scene(this.currentScene);
      return true;
    }catch{await this.stop();return false}
  }
  scene(ambient){
    this.currentScene=Object.hasOwn(NOTES,ambient)?ambient:'air';
    if(!this.on||!this.context)return;
    const now=this.context.currentTime;
    const quiet=ambient==='silence';
    this.ambient.frequency.setTargetAtTime(NOTES[this.currentScene]||98,now,.75);
    this.toneGain.gain.setTargetAtTime(quiet?0:.08,now,.35);
  }
  cue(kind='choice'){
    if(!this.on||!this.context)return;
    try{
      const t=this.context.currentTime;
      const oscillator=this.context.createOscillator();
      const gain=this.context.createGain();
      oscillator.type='sine';
      oscillator.frequency.setValueAtTime(kind==='fragment'?590:kind==='reveal'?220:310,t);
      oscillator.frequency.exponentialRampToValueAtTime(kind==='fragment'?880:520,t+.19);
      gain.gain.setValueAtTime(0.0001,t);
      gain.gain.exponentialRampToValueAtTime(Math.max(.004,this.volume*.075),t+.018);
      gain.gain.exponentialRampToValueAtTime(.0001,t+.37);
      oscillator.connect(gain);gain.connect(this.context.destination);
      oscillator.start(t);oscillator.stop(t+.4);
    }catch{ /* sound is optional; graphics and navigation still work */ }
  }
  setVolume(value){
    if(!Number.isFinite(value))return;
    this.volume=Math.max(0,Math.min(1,value));
    if(this.context&&this.master)
      this.master.gain.setTargetAtTime(this.volume*.085,this.context.currentTime,.09);
  }
  async stop(){
    const context=this.context;
    this.context=null;this.on=false;
    this.master=null;this.ambient=null;this.toneGain=null;
    if(context){try{await context.close()}catch{}}
  }
}
