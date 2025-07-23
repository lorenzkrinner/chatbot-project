import { SendIcon } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Main() {
  // Suggestion cards data
  const suggestions = [
    {
      text: "What can I ask you to do?",
      className: "left-0",
    },
    {
      text: "Which one of my projects is performing the best?",
      className: "left-[308px]",
    },
    {
      text: "What projects should I be concerned about right now?",
      className: "left-[616px]",
    },
  ];

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white overflow-hidden w-[1280px] h-[832px] relative">
        {/* Colorful background gradients */}
        <div className="absolute w-[883px] h-[464px] top-[501px] left-[222px]">
          <div className="absolute w-[544px] h-[464px] top-0 left-[136px]">
            <div className="relative h-[464px]">
              <div className="absolute w-[280px] h-[280px] top-0 left-[264px] bg-[#89bcff] rounded-[140px] blur-[150px]" />
              <div className="absolute w-[414px] h-[414px] top-[50px] left-0 bg-[#ff86e1] rounded-[207px] blur-[250px]" />
            </div>
          </div>

          {/* Suggestions section */}
          <div className="absolute top-[108px] left-2.5 font-bold text-[#56637e] text-sm tracking-[0] leading-normal font-sans">
            Suggestions on what to ask Our AI
          </div>

          {/* Suggestion cards */}
          {suggestions.map((suggestion, index) => (
            <Card
              key={`suggestion-${index}`}
              className={`inline-flex justify-center gap-2.5 p-2.5 top-36 ${suggestion.className} bg-[#ffffff80] rounded-lg border border-solid border-white items-center absolute`}
            >
              <div className="relative w-[274px] mt-[-1.00px] font-normal text-[#160211] text-sm tracking-[0] leading-normal font-sans">
                {suggestion.text}
              </div>
            </Card>
          ))}

          {/* Input field with send button */}
          <div className="flex w-[883px] justify-between p-2.5 top-[238px] left-0 bg-white rounded-lg border border-solid border-[#1602114c] items-center absolute">
            <Input
              className="border-none shadow-none font-sans font-normal text-[#56637e] text-sm tracking-[0] leading-normal"
              placeholder="Ask me anything about your projects"
            />
            <Button variant="ghost" size="icon" className="relative w-9 h-9">
              <SendIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Title and icon section */}
        <div className="flex flex-col w-[409px] gap-12 top-[164px] left-[435px] items-center absolute">
          <div className="relative w-9 h-[37.83px]">
            <div className="relative h-[38px]">
              <img
                className="top-[17px] left-0 absolute w-[21px] h-[21px]"
                alt="Star"
                src="/star-2.svg"
              />
              <img
                className="top-2 left-[15px] absolute w-[21px] h-[21px]"
                alt="Star"
                src="/star-2.svg"
              />
              <img
                className="top-0 left-0 absolute w-[21px] h-[21px]"
                alt="Star"
                src="/star-2.svg"
              />
            </div>
          </div>

          <h1 className="relative self-stretch font-sans font-normal text-[#160211] text-2xl text-center tracking-[0] leading-normal">
            Ask our AI anything
          </h1>
        </div>
      </div>
    </div>
  );
};
