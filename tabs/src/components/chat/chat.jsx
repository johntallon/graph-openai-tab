import {
  Avatar,
  Button,
  Input,
  Text,
  Spinner,
  teamsLightTheme,
  makeStyles,
  shorthands,
} from "@fluentui/react-components";
import { List, Box, Flex } from "@fluentui/react-northstar";
import { Card } from "@fluentui/react-components/unstable";
import { useContext, useState } from "react";
import { useTeams } from "@microsoft/teamsfx-react";

const OPENAI_API_KEY = "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";
const chatHistory = [];

const useStyles = makeStyles({
  card: {
    ...shorthands.margin("auto"),
    width: "720px",
    maxWidth: "100%",
  },
});

const userID = crypto.randomUUID();

export function GPTChat() {
  const { context } = useTeams({})[0];
  const [input, setinput] = useState("");
  const [waiting, setWaiting] = useState();
  const styles = useStyles();

  function addToChatHistory(element, actor) {
    chatHistory.push({
      key: crypto.randomUUID(),
      headerMedia: new Date().toLocaleString(),
      content: element,
      media: <Avatar name={actor} />,
    });
  }

  async function processChatPrompt(event) {
    event.preventDefault();
    setWaiting(<Spinner size="small" />);
    let prompt = input;

    addToChatHistory(prompt, context.user.userPrincipalName);
    setinput("");
    let response = await submitRequest(prompt);
    addToChatHistory(response.choices[0].text, "Artifical Intelligence");
    setWaiting(<div />);
  }

  async function submitRequest(prompt) {
    let response = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt: `${prompt}`,
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 1,
        frequency_penalty: 1,
        //stream: true, //For some reason this was not returning an response
        presence_penalty: 1,
      }),
    });

    return await response.json();
  }

  //Purpose here will to format the chat response messgae and add it to a list/stack
  function FormatAIResponse(text) {
    return (
      <div>
        <Text as="h5" content="AI |Response:" />
        <Text as="h6" content={text} />
      </div>
    );
  }

  //Purpose here will to format the chat response messgae and add it to a list/stack
  function FormatUserPrompt(text) {
    return (
      <div>
        <Text as="h5" content="You:" align="end" />
        <Text as="h6" content={text} align="end" />
      </div>
    );
  }

  return (
    <div className="prompt-text">
      <div>
        {/* <Box theme={teamsLightTheme} styles={{ backgroundColor: "#eeeeee" }}>
          <List selectable defaultSelectedIndex={0} items={chatHistory} />
        </Box> */}

        <div>
          {chatHistory.map((item) => (
            <div>
              <p>
                {item.media}
                {item.content}
              </p>
              <strong>{item.headerMedia}</strong>
            </div>
          ))}
        </div>

        <form onSubmit={processChatPrompt}>
          <table>
            <tr>
              <td>
                <Input
                  className="prompt-text"
                  type="text"
                  name="input"
                  label="What would you like to talk about?"
                  value={input}
                  onChange={(e) => setinput(e.target.value)}
                />
              </td>
              <td width="5%">
                <Button type="submit">Ask AI</Button>
              </td>
              <td width="5%">{waiting}</td>
            </tr>
          </table>
        </form>
        <section className={styles.section}></section>
      </div>
    </div>
  );
}
