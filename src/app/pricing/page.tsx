"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Check, Star, Zap } from "lucide-react";
import { SubscriptionContext } from "@/context/SubscriptionContext";
import { useToast } from "@/hooks/use-toast";

interface Plan {
    name: string;
    price: string;
    type: 'Mensal' | 'Anual';
}

export default function PricingPage() {
    const router = useRouter();
    const { toast } = useToast();
    const subscriptionContext = useContext(SubscriptionContext);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState("");


    if (!subscriptionContext) {
        throw new Error("SubscriptionContext must be used within a SubscriptionProvider");
    }

    const { subscribe } = subscriptionContext;

    const handleSelectPlan = (plan: Plan) => {
        setSelectedPlan(plan);
        setIsDialogOpen(true);
        setConfirmationMessage(""); // Reset message on new dialog open
    };

    const handleConfirmPayment = () => {
        if (!selectedPlan) return;
        subscribe();
        toast({
            title: "Inscrição Ativada!",
            description: `Você agora está no plano ${selectedPlan.name}. Aproveite!`,
            className: "bg-green-500/10 border-green-500 text-white"
        });
        setIsDialogOpen(false);
        router.push("/");
    };

    const plans: { monthly: Plan, yearly: Plan } = {
        monthly: { name: "Mensal", price: "150 MT", type: 'Mensal' },
        yearly: { name: "Anual", price: "1500 MT", type: 'Anual' }
    };

    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background text-foreground">
                <div className="w-full max-w-4xl text-center">
                    <h1 className="flex items-center justify-center gap-3 text-5xl font-extrabold animate-blink-colors mb-4">
                        <Zap className="text-primary" size={48} />
                        Nossos Planos
                    </h1>
                    <p className="max-w-2xl mx-auto mb-12 text-lg text-muted-foreground">
                        Escolha o plano perfeito para você e comece a baixar vídeos ilimitados hoje mesmo. Sem complicações.
                    </p>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        {/* Plano Mensal */}
                        <Card className="relative flex flex-col justify-between overflow-hidden border-2 bg-card/80 backdrop-blur-sm shadow-xl border-border hover:border-primary/50 transition-all duration-300">
                            <CardHeader className="text-left">
                                <CardTitle className="flex items-center gap-2 text-2xl font-bold">
                                    <Star /> Plano Mensal
                                </CardTitle>
                                <CardDescription>
                                    Acesso completo por um mês.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow text-left">
                                <div className="mb-6">
                                    <span className="text-5xl font-bold">150</span>
                                    <span className="ml-2 text-xl text-muted-foreground">MT /mês</span>
                                </div>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3">
                                        <Check className="w-5 h-5 text-green-400" />
                                        <span>Downloads ilimitados</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Check className="w-5 h-5 text-green-400" />
                                        <span>Todas as plataformas</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Check className="w-5 h-5 text-green-400" />
                                        <span>Downloads em alta qualidade</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Check className="w-5 h-5 text-green-400" />
                                        <span>Suporte prioritário</span>
                                    </li>
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={() => handleSelectPlan(plans.monthly)} className="w-full h-12 text-lg font-bold">
                                    Assinar Agora
                                </Button>
                            </CardFooter>
                        </Card>

                        {/* Plano Anual */}
                        <Card className="relative flex flex-col justify-between overflow-hidden border-2 bg-card/80 backdrop-blur-sm shadow-2xl shadow-primary/20 border-primary">
                            <div className="absolute top-0 right-0 px-4 py-1 text-sm font-bold text-white rounded-bl-lg bg-primary">
                                MAIS POPULAR
                            </div>
                            <CardHeader className="text-left">
                                <CardTitle className="flex items-center gap-2 text-2xl font-bold text-primary">
                                    <Zap /> Plano Anual
                                </CardTitle>
                                <CardDescription>
                                    Economize com o nosso melhor plano!
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow text-left">
                                <div className="mb-6">
                                    <span className="text-5xl font-bold">1500</span>
                                    <span className="ml-2 text-xl text-muted-foreground">MT /ano</span>
                                </div>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3">
                                        <Check className="w-5 h-5 text-green-400" />
                                        <span>Downloads ilimitados</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Check className="w-5 h-5 text-green-400" />
                                        <span>Todas as plataformas</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Check className="w-5 h-5 text-green-400" />
                                        <span>Downloads em alta qualidade</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Check className="w-5 h-5 text-green-400" />
                                        <span>Suporte prioritário</span>
                                    </li>
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={() => handleSelectPlan(plans.yearly)} className="w-full h-12 text-lg font-bold bg-gradient-to-r from-primary to-pink-500 hover:shadow-lg hover:shadow-primary/40">
                                    Assinar Agora
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>

                    <Button variant="link" onClick={() => router.push('/')} className="mt-12 text-muted-foreground">
                        Voltar para o início
                    </Button>
                </div>
            </div>

            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Instruções de Pagamento</AlertDialogTitle>
                        <AlertDialogDescription>
                            Para ativar seu plano {selectedPlan?.name} ({selectedPlan?.price}), faça a transferência para uma das contas abaixo.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="p-4 my-4 space-y-4 border rounded-lg bg-secondary border-border">
                        <div>
                            <h3 className="font-bold text-lg text-green-400">M-Pesa</h3>
                            <p className="text-muted-foreground">Número: <span className="font-mono text-white">845383993</span></p>
                            <p className="text-muted-foreground">Nome: <span className="text-white">Joaneta</span></p>
                        </div>
                        <div className="pt-4 border-t border-border">
                            <h3 className="font-bold text-lg text-orange-400">E-Mola</h3>
                            <p className="text-muted-foreground">Número: <span className="font-mono text-white">862961638</span></p>
                            <p className="text-muted-foreground">Nome: <span className="text-white">Manuel</span></p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="confirmation-message" className="text-sm font-medium leading-none text-foreground">
                            Cole a Mensagem de Confirmação
                        </label>
                        <Textarea
                            id="confirmation-message"
                            placeholder="Ex: Confirmado CL44I9N5U22. Transferiste 150.00MT..."
                            value={confirmationMessage}
                            onChange={(e) => setConfirmationMessage(e.target.value)}
                            className="min-h-[100px]"
                        />
                    </div>
                     <p className="text-xs text-center text-muted-foreground">
                        Após colar a mensagem de confirmação, clique no botão abaixo para ativar.
                    </p>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmPayment} disabled={!confirmationMessage.trim()}>
                            Já Paguei, Ativar Plano
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
