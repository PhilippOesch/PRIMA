namespace RTS_V2 {
    import ƒ = FudgeCore;

    export enum AUDIO {
        SHOOT = "assets/sounds/shooting-sound.ogg",
        IMPACT = "assets/sounds/impact-sound.ogg"
    }

    export class Audio extends ƒ.Node {
        private static components: Map<AUDIO, ƒ.ComponentAudio> = new Map();
        private static readonly node: Audio = new Audio("Audio");

        public static start(): void {
            Audio.appendAudio();
            viewport.getGraph().appendChild(Audio.node);
            ƒ.AudioManager.default.listenTo(Audio.node);
        }

        public static play(_audio: AUDIO): void {
              Audio.getAudio(_audio).play(true);
        }

        public static getAudio(_audio: AUDIO): ƒ.ComponentAudio {
            return Audio.components.get(_audio);
        }

        private static async appendAudio(): Promise<void> {
            Audio.components.set(AUDIO.SHOOT, new ƒ.ComponentAudio(await ƒ.Audio.load(AUDIO.SHOOT), false, false));
            Audio.components.set(AUDIO.IMPACT, new ƒ.ComponentAudio(await ƒ.Audio.load(AUDIO.IMPACT), false, false));

            Audio.components.get(AUDIO.SHOOT).volume = 0.5;
            Audio.components.get(AUDIO.IMPACT).volume = 0.5;

            Audio.components.forEach(value => Audio.node.addComponent(value));
        }
    }
}