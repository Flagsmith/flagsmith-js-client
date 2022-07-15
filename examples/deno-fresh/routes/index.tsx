/** @jsx h */
import { h } from "preact";
import flagsmith from 'flagsmith'
import { Handlers, PageProps } from "$fresh/server.ts";
const environmentID = "QjgYur4LQTwe5HpvbvhpzK"

type Props = {
    font_size: number
}
export const handler: Handlers<Props> = {
    async GET(_req, ctx) {
        await flagsmith.init({ // fetches flags on the server
            environmentID,
        });
        return ctx.render({font_size:flagsmith.getValue("font_size")});
    },
};


export default function Page({ data }: PageProps<Props | null>) {
  return (
    <div>
        {data.font_size}
    </div>
  );
}
