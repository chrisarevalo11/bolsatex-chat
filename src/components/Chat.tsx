import { useState } from 'react'
import { CornerDownLeft, Paperclip } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

type Message = {
    sender: 'user' | 'bot'
    content: string
}

export default function Chat() {
    const [messages, setMessages] = useState<Message[]>([])
    const [inputValue, setInputValue] = useState('')

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (inputValue.trim()) {
            const userMessage: Message = {
                sender: 'user',
                content: inputValue.trim(),
            }
            setMessages((prevMessages) => [...prevMessages, userMessage])

            const botResponse: string = await getBotResponse(inputValue.trim())
            setInputValue('')
            const botMessage: Message = { sender: 'bot', content: botResponse }

            setMessages((prevMessages) => [...prevMessages, botMessage])
        }
    }

    const getBotResponse = async (question: string) => {
        const body = { question }

        const response = await fetch('http://127.0.0.1:5000/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })

        const data = await response.json()
        return data.answer
    }

    return (
        <div className="relative flex h-full w-full max-w-[900px] min-h-[600px flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
            <div className="flex-1 overflow-auto min-h-[600px] max-h-[600px]">
                <div className="flex flex-col space-y-3 p-3">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`p-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
                            >
                                {msg.content}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <form
                onSubmit={handleSubmit}
                className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
                x-chunk="dashboard-03-chunk-1"
            >
                <Label htmlFor="message" className="sr-only">
                    Message
                </Label>
                <Textarea
                    id="message"
                    placeholder="Type your message here..."
                    value={inputValue}
                    onChange={handleInputChange}
                    className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
                />
                <div className="flex items-center p-3 ">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Paperclip className="size-4" />
                                <span className="sr-only">Attach file</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">Attach File</TooltipContent>
                    </Tooltip>
                    <Button type="submit" size="sm" className="ml-auto gap-1.5">
                        Send Message
                        <CornerDownLeft className="size-3.5" />
                    </Button>
                </div>
            </form>
        </div>
    )
}
