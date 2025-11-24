"use client"

import { useState } from "react"
import { CreditCard, Smartphone, Building2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

export function PaymentForm() {
  const [paymentMethod, setPaymentMethod] = useState("card")

  return (
    <div className="space-y-8">
      <RadioGroup
        defaultValue="card"
        onValueChange={setPaymentMethod}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div>
          <RadioGroupItem value="card" id="card" className="peer sr-only" />
          <Label
            htmlFor="card"
            className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all h-full"
          >
            <CreditCard className="mb-3 h-6 w-6" />
            <span className="text-sm font-medium">Cartão de Crédito</span>
          </Label>
        </div>
        <div>
          <RadioGroupItem value="mbway" id="mbway" className="peer sr-only" />
          <Label
            htmlFor="mbway"
            className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all h-full"
          >
            <Smartphone className="mb-3 h-6 w-6" />
            <span className="text-sm font-medium">MB WAY</span>
          </Label>
        </div>
        <div>
          <RadioGroupItem value="multibanco" id="multibanco" className="peer sr-only" />
          <Label
            htmlFor="multibanco"
            className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all h-full"
          >
            <Building2 className="mb-3 h-6 w-6" />
            <span className="text-sm font-medium">Multibanco</span>
          </Label>
        </div>
      </RadioGroup>

      {paymentMethod === "card" && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="space-y-2">
            <Label htmlFor="cardName">Nome no Cartão</Label>
            <Input id="cardName" placeholder="Como aparece no cartão" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Número do Cartão</Label>
            <div className="relative">
              <Input id="cardNumber" placeholder="0000 0000 0000 0000" />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                <div className="w-8 h-5 bg-gray-200 rounded" />
                <div className="w-8 h-5 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Validade</Label>
              <Input id="expiry" placeholder="MM/AA" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input id="cvc" placeholder="123" />
            </div>
          </div>
        </div>
      )}

      {paymentMethod === "mbway" && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300 bg-gray-50 p-6 rounded-xl text-center">
          <div className="max-w-xs mx-auto space-y-4">
            <Label htmlFor="phone">Número de Telemóvel</Label>
            <Input id="phone" type="tel" placeholder="+351 912 345 678" className="text-center text-lg" />
            <p className="text-xs text-gray-500">
              Enviaremos uma notificação para a sua app MB WAY para autorizar o pagamento.
            </p>
          </div>
        </div>
      )}

      {paymentMethod === "multibanco" && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300 bg-gray-50 p-6 rounded-xl text-center">
          <p className="text-sm text-gray-600">
            Ao confirmar, será gerada uma referência Multibanco válida por 24 horas.
          </p>
          <div className="flex justify-center gap-8 text-sm font-mono bg-white p-4 rounded border border-gray-200 inline-flex mx-auto">
            <div className="text-left">
              <div className="text-gray-400 text-xs">Entidade</div>
              <div className="font-bold">12345</div>
            </div>
            <div className="text-left">
              <div className="text-gray-400 text-xs">Referência</div>
              <div className="font-bold">123 456 789</div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4 pt-4 border-t border-gray-100">
        <h3 className="font-medium text-gray-900">Dados de Faturação</h3>
        <div className="space-y-2">
          <Label htmlFor="address">Morada</Label>
          <Input id="address" placeholder="Rua, Número, Andar" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="zip">Código Postal</Label>
            <Input id="zip" placeholder="0000-000" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">Cidade</Label>
            <Input id="city" placeholder="Lisboa" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">País</Label>
          <Select defaultValue="pt">
            <SelectTrigger>
              <SelectValue placeholder="Selecione o país" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pt">Portugal</SelectItem>
              <SelectItem value="es">Espanha</SelectItem>
              <SelectItem value="fr">França</SelectItem>
              <SelectItem value="uk">Reino Unido</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="pt-6">
        <Link href="/checkout/success">
          <Button className="w-full h-12 text-lg font-bold bg-primary hover:bg-primary/90">Pagar €85.00</Button>
        </Link>
        <p className="text-center text-xs text-gray-500 mt-4">
          Ao clicar em "Pagar", aceita os nossos Termos e Condições e Política de Privacidade.
        </p>
      </div>
    </div>
  )
}
