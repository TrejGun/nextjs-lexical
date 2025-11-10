import {
  DecoratorNode,
  DOMConversionMap,
  DOMConversionOutput,
  type EditorConfig,
  type LexicalEditor,
  type NodeKey,
  type SerializedLexicalNode,
  type Spread,
} from "lexical";
import React from "react";

import {
  ParsedVideo,
  parseVideoUrl,
  VideoProvider,
} from "../../utils/parseVideoUrl";
import { IVideoNodeProps, VideoComponent } from "./VideoComponent";

export type SerializedVideoNode = Spread<
  {
    type: "video";
    version: 1;
    provider: VideoProvider;
    videoId: string;
    embedUrl: string;
    startAt?: number | null;
    originalUrl: string;
  },
  SerializedLexicalNode
>;

export class VideoNode extends DecoratorNode<React.JSX.Element> {
  __provider: VideoProvider;
  __videoId: string;
  __embedUrl: string;
  __startAt?: number | null;
  __originalUrl: string;

  static getType() {
    return "video";
  }

  static clone(node: VideoNode): VideoNode {
    return new VideoNode(
      {
        provider: node.__provider,
        videoId: node.__videoId,
        embedUrl: node.__embedUrl,
        startAt: node.__startAt ?? null,
        originalUrl: node.__originalUrl,
      },
      node.__key,
    );
  }

  constructor(props: IVideoNodeProps, key?: NodeKey) {
    super(key);
    this.__provider = props.provider;
    this.__videoId = props.videoId;
    this.__embedUrl = props.embedUrl;
    this.__startAt = props.startAt ?? null;
    this.__originalUrl = props.originalUrl;
  }

  static importJSON(serializedNode: SerializedVideoNode): VideoNode {
    const { provider, videoId, embedUrl, startAt, originalUrl } =
      serializedNode;
    return new VideoNode({ provider, videoId, embedUrl, startAt, originalUrl });
  }

  exportJSON(): SerializedVideoNode {
    return {
      type: "video",
      version: 1,
      provider: this.__provider,
      videoId: this.__videoId,
      embedUrl: this.__embedUrl,
      startAt: this.__startAt ?? null,
      originalUrl: this.__originalUrl,
    };
  }

  static importDOM(): DOMConversionMap {
    return {
      iframe: (domNode) => {
        const el = domNode as HTMLIFrameElement;
        if (!(el instanceof HTMLIFrameElement)) return null;

        const src = el.getAttribute("src") || "";
        const parsed = parseVideoUrl(src);
        if (!parsed) return null;

        return {
          priority: 2,
          conversion: (): DOMConversionOutput => {
            return { node: $createVideoNode(parsed) };
          },
        };
      },

      div: (domNode) => {
        const el = domNode as HTMLDivElement;
        if (!(el instanceof HTMLDivElement)) return null;

        if (!el.classList.contains("lexical-video")) return null;
        const iframe = el.querySelector("iframe");
        if (!(iframe instanceof HTMLIFrameElement)) return null;

        const src = iframe.getAttribute("src") || "";
        const parsed = parseVideoUrl(src);
        if (!parsed) return null;

        return {
          priority: 2,
          conversion: (): DOMConversionOutput => {
            return { node: $createVideoNode(parsed) };
          },
        };
      },
    };
  }

  exportDOM(): { element: HTMLElement } {
    const wrapper = document.createElement("div");
    wrapper.className = "lexical-video";
    const inner = document.createElement("div");
    inner.className = "lexical-video__inner";
    const iframe = document.createElement("iframe");
    iframe.className = "lexical-video__iframe";
    iframe.setAttribute("src", this.__embedUrl);
    iframe.setAttribute("loading", "lazy");
    iframe.setAttribute(
      "allow",
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
    );
    iframe.setAttribute("allowfullscreen", "true");

    inner.appendChild(iframe);
    wrapper.appendChild(inner);
    return { element: wrapper };
  }

  createDOM(_config: EditorConfig, _editor: LexicalEditor): HTMLElement {
    const div = document.createElement("div");
    div.className = "lexical-video";
    return div;
  }

  updateDOM(): false {
    return false;
  }

  decorate(): React.JSX.Element {
    return (
      <VideoComponent
        provider={this.__provider}
        videoId={this.__videoId}
        embedUrl={this.__embedUrl}
        startAt={this.__startAt ?? undefined}
        originalUrl={this.__originalUrl}
      />
    );
  }
}

export function $createVideoNode(parsed: ParsedVideo): VideoNode {
  return new VideoNode({
    provider: parsed.provider,
    videoId: parsed.id,
    embedUrl: parsed.embedUrl,
    startAt: parsed.startAt,
    originalUrl: parsed.originalUrl,
  });
}

export function $isVideoNode(node: unknown): node is VideoNode {
  return node instanceof VideoNode;
}
